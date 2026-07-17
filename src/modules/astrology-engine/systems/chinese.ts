import type { AstrologyProvider, ChartCalculationInput, ChartCalculationResult } from '../types';

const ANIMALS = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig',
] as const;

const ELEMENTS_CYCLE = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;

export class ChineseAstrologyProvider implements AstrologyProvider {
  readonly id = 'chinese' as const;
  readonly name = 'Chinese Astrology';

  async calculateChart(input: ChartCalculationInput): Promise<ChartCalculationResult> {
    const { birthDate } = input;
    const animal = this.getAnimal(birthDate.getFullYear());
    const element = this.getElement(birthDate.getFullYear());

    return {
      positions: [
        {
          planet: 'Year Pillar',
          sign: `${element} ${animal}`,
          degree: 0,
          minute: 0,
          retrograde: false,
          house: 1,
        },
      ],
      houses: [],
      aspects: [],
      ascendant: { sign: animal, degree: 0 },
      midheaven: { sign: element, degree: 0 },
    };
  }

  getSunSign(date: Date): string {
    return this.getAnimal(date.getFullYear());
  }

  async getMoonSign(_date: Date, _time: string, _latitude: number, _longitude: number): Promise<string> {
    return 'Rat';
  }

  private getAnimal(year: number): string {
    return ANIMALS[(year - 4) % 12];
  }

  private getElement(year: number): string {
    return ELEMENTS_CYCLE[Math.floor(((year - 4) % 10) / 2)];
  }
}
