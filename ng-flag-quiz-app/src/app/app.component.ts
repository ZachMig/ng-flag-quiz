import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuizUIComponent } from './quiz-ui/quiz-ui.component';
import codesByPreset from '../assets/presetCountries.json';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, QuizUIComponent, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  menuOpen: boolean = true;
  gameInProgress: boolean = false;

  codes: string[] = [];
  codesByPresetMap: Record<string, string[]> = codesByPreset;

  activePresets = new Map<string, boolean>();
  numActivePresets: number = 0;
  presets: string[] = [
    'Americas',
    'Europe',
    'Asia',
    'Middle East',
    'Africa',
    'OCE',
    'GeoGuessr',
    'Islands',
  ];

  // Handle game start or restart ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  startGame() {
    console.log('Starting game.');

    if (this.numActivePresets < 1) {
      console.log('Attempted to start game with no presets selected.');
      return;
    }

    const selectedCountryCodesSet = new Set<string>();

    // Build set of all selected country codes by preset
    for (const preset of this.presets) {
      console.log('Checking if ' + preset + ' is active');
      if (this.activePresets.get(preset) === true) {
        console.log(
          'Adding ' +
            this.codesByPresetMap[preset] +
            ' codes for preset ' +
            preset
        );
        for (const countryCode of this.codesByPresetMap[preset]) {
          selectedCountryCodesSet.add(countryCode);
        }
      }
    }

    this.codes = [...selectedCountryCodesSet];
    this.shuffleCodes();

    console.log('Passing ' + this.codes.length + ' country codes to QuizUI');

    this.menuOpen = false;
    // this.handleMenuToggle();
    this.gameInProgress = true;
  }

  // Handle game end, triggered on reaching last prompt ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Arrow function notation to preserve context, as it is being passed to child
  endGame = () => {
    console.log('End game called.');
    this.menuOpen = true;
    this.gameInProgress = false;
  };

  // Toggle menu on Keyboard Escape press ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Arrow function notation so it preserves context from this class
  handleKeyDown = (keyEvent: KeyboardEvent) => {
    keyEvent.preventDefault();

    if (keyEvent.key === 'Escape') {
      if (!this.gameInProgress) {
        console.log('Attempted to close menu without game in progress.');
        return;
      }

      this.menuOpen = !this.menuOpen;
    }
  };

  // Toggle Menu Overlay ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Arrow function notation so it preserves context from this class
  handleMenuToggle = (event: MouseEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();

    if (!this.gameInProgress) {
      console.log('Attempted to close menu without game in progress.');
      return;
    }

    this.menuOpen = !this.menuOpen;
  };

  // Toggle the clicked preset on or off ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Arrow function notation so it preserves context from this class
  handlePresetSelect = (preset: string) => {
    const isActive = this.activePresets.get(preset);

    if (isActive) {
      this.numActivePresets--;
    } else {
      this.numActivePresets++;
    }

    this.activePresets.set(preset, !isActive); // Toggle
  };

  // Shuffle selected prompts ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  shuffleCodes(): void {
    // Fisher-Yates Shuffle
    console.log('Shuffling Country Codes.');

    for (let i = this.codes.length - 1; i >= 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.codes[j];
      this.codes[j] = this.codes[i];
      this.codes[i] = temp;
    }
  }

  // Setup ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ngOnInit() {
    console.log('Starting AppComponent');
    document.addEventListener('keydown', this.handleKeyDown);

    document
      .getElementById('burger-icon-id')
      ?.addEventListener('mousedown', this.handleMenuToggle, true);

    for (const preset in this.presets) {
      this.activePresets.set(preset, false);
    }
    console.log('Set ' + this.activePresets.size + ' presets');
  }

  // Teardown ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
}
