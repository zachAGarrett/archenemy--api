/**
 * Ziggurat class to generate normally distributed random numbers using the Ziggurat algorithm.
 */
export class Ziggurat {
  // Constants for the Ziggurat algorithm
  private static readonly R: number = 3.442619855899;
  private static readonly MAX: number = 256;
  private static readonly AREA: number = 9.91256303526217e-3;

  private x: Float32Array;
  private y: Float32Array;

  /**
   * Constructs a new Ziggurat instance and initializes the x and y tables.
   */
  constructor() {
    this.x = new Float32Array(Ziggurat.MAX);
    this.y = new Float32Array(Ziggurat.MAX);
    this.generateTables();
  }

  /**
   * Generates the x and y tables used in the Ziggurat algorithm.
   */
  private generateTables() {
    this.x[0] = Ziggurat.R;
    this.y[0] = Math.exp(-0.5 * Ziggurat.R * Ziggurat.R);

    for (let i = 1; i < Ziggurat.MAX; i++) {
      this.x[i] = Math.sqrt(-2.0 * Math.log(this.y[i - 1]));
      this.y[i] = this.y[i - 1] + Ziggurat.AREA / this.x[i];
    }
  }

  /**
   * Generates a uniform random number between 0 and 1.
   * This function should be replaced with a cryptographically secure random number generator for security-critical applications.
   *
   * @returns A uniform random number between 0 and 1.
   */
  private uniform(): number {
    return Math.random();
  }

  /**
   * Generates a random number from the tail of the normal distribution.
   *
   * @returns A random number from the tail of the normal distribution.
   */
  private normalTail(): number {
    let x: number, y: number;
    do {
      x = -Math.log(this.uniform()) / Ziggurat.R;
      y = -Math.log(this.uniform());
    } while (2 * y < x * x);
    return x + Ziggurat.R;
  }

  /**
   * Generates the next normally distributed random number using the Ziggurat algorithm.
   *
   * @returns A normally distributed random number.
   */
  public next(): number {
    while (true) {
      const u1: number = this.uniform();
      const u2: number = 2 * this.uniform() - 1;
      const i: number = Math.floor(u1 * Ziggurat.MAX);
      const x: number = u2 * this.x[i];
      if (Math.abs(u2) < this.y[i]) {
        return x;
      }
      if (i === 0) {
        return this.normalTail();
      }
      const y: number =
        this.y[i - 1] + (this.y[i] - this.y[i - 1]) * this.uniform();
      if (y < Math.exp(-0.5 * x * x)) {
        return x;
      }
    }
  }
}
