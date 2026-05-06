export interface Stat {
  readonly label: string;
  readonly value: number;
  readonly suffix: string;
}

export interface Program {
  readonly name: string;
  readonly desc: string;
  readonly icon: string;
}

export interface PromoEvent {
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly date: string;
  readonly time: string;
  readonly venue: string;
}
