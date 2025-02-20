import { Modifier } from "../Modifier";
import { MathEx } from "../../math/MathEx";

/**
 * Rotates particle along velocity vector.
 *
 * @cat particles.modifiers
 * @extends Modifier
 */
export class Oriented extends Modifier {
  /**
   * Creates new instance of oriented modifier.
   */
  constructor(angleShift = 0) {
    super(false);
    this.mAngleShift = angleShift;
  }

  /**
   * @inheritDoc
   */
  update(emitter, particle, dt) {
    particle.r = (Math.atan2(particle.vy, particle.vx) * MathEx.RAD2DEG - (90 + this.mAngleShift)) * dt;
  }
}
