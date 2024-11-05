import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import countries from '../../assets/countries.json';

@Component({
  selector: 'quiz-ui',
  standalone: true,
  imports: [NgClass],
  templateUrl: './quiz-ui.component.html',
  styleUrl: './quiz-ui.component.css',
})
export class QuizUIComponent {
  @Input() selectedCountryCodes!: string[];
  @Input() handleGameEnd!: () => void;

  countryMap: Map<string, string> = new Map(Object.entries(countries));
  numChoices: number = 0;
  inbetweenRounds: boolean = false;
  countryCodeIndex: number = 0;
  options: string[] = [];
  onSelectResponse: string = '';
  answerStr: string = '';
  showAnswer: boolean = false;
  countryCodeToShow: string = '';

  // Generate options for user to choose from for this flag ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  generateOptions() {
    console.log(
      'Generating options for index ' +
        this.countryCodeIndex +
        ': ' +
        this.selectedCountryCodes[this.countryCodeIndex]
    );

    // Set of country codes
    const optionsSet = new Set<string>();

    // Add the correct option
    optionsSet.add(this.selectedCountryCodes[this.countryCodeIndex]);

    // Generate bait options
    while (optionsSet.size < this.numChoices) {
      const index = Math.floor(
        Math.random() * this.selectedCountryCodes.length
      );
      optionsSet.add(this.selectedCountryCodes[index]);
    }

    // Change set into arr to shuffle
    const newOptions: string[] = [...optionsSet];

    // Fisher-Yates Shuffle
    for (let i = newOptions.length - 1; i >= 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = newOptions[j];
      newOptions[j] = newOptions[i];
      newOptions[i] = temp;
    }

    this.options = newOptions;
  }

  // Advance the game from answer reveal, to the next flag to guess ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Arrow function notation so it preserves context from this class
  handleGameAdvance = (event: MouseEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    console.log('Advancing round');
    document.removeEventListener('mousedown', this.handleGameAdvance, true);

    this.inbetweenRounds = false;
    this.onSelectResponse = '';
    this.answerStr = '';

    if (this.countryCodeIndex === this.selectedCountryCodes.length - 1) {
      // End game
      this.handleGameEnd();
      return;
    }

    this.countryCodeIndex++;
    this.countryCodeToShow = this.selectedCountryCodes[this.countryCodeIndex];
    this.generateOptions();
  };

  // Handle user guessing an option ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Arrow function notation so it preserves context from this class
  handleOptionClick = (option: string) => {
    console.log(option + ' selected.');
    this.inbetweenRounds = true;

    if (this.selectedCountryCodes[this.countryCodeIndex] === option) {
      this.onSelectResponse = 'Nice!';
    } else {
      this.onSelectResponse = 'Whoops!';
    }
    this.answerStr =
      this.countryMap.get(this.selectedCountryCodes[this.countryCodeIndex]) ??
      '';

    document.addEventListener('mousedown', this.handleGameAdvance, true);
  };

  // Handle user mousing over an option, post-guess ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Arrow function notation so it preserves context from this class
  handleMouseOver = (option: string) => {
    if (!this.inbetweenRounds) {
      return;
    }

    this.countryCodeToShow = option;
  };

  // Handle user mousing away from an option, post-guess ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Arrow function notation so it preserves context from this class
  handleMouseLeave = () => {
    if (!this.inbetweenRounds) {
      return;
    }

    this.countryCodeToShow = this.selectedCountryCodes[this.countryCodeIndex];
  };

  ngOnInit() {
    this.numChoices = Math.min(12, this.selectedCountryCodes.length);
    this.countryCodeToShow = this.selectedCountryCodes[this.countryCodeIndex];
    this.generateOptions();
    // console.log(this.options.length);
  }

  ngOnChanges() {
    this.numChoices = Math.min(12, this.selectedCountryCodes.length);
    this.countryCodeIndex = 0;
    this.countryCodeToShow = this.selectedCountryCodes[this.countryCodeIndex];
    this.inbetweenRounds = false;
    this.answerStr = '';
    this.onSelectResponse = '';
    this.showAnswer = false;
    this.generateOptions();
  }
}
