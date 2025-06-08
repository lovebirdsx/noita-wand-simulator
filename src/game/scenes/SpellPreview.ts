import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class SpellPreview extends Scene {
  projectile: Phaser.GameObjects.Image | null = null;

  constructor() {
    super('SpellPreview');
  }

  create() {
    this.add.image(512, 384, 'background');
    this.projectile = this.add.image(100, 700, 'star');

    EventBus.emit('current-scene-ready', this);
    EventBus.on('spell-run', this.runSpell, this);
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      EventBus.off('spell-run', this.runSpell, this);
    });
  }

  runSpell(data: { speed: number; angle: number }) {
    if (!this.projectile) {
      this.projectile = this.add.image(100, 700, 'star');
    }
    this.projectile.setPosition(100, 700);
    const rad = (data.angle * Math.PI) / 180;
    const endX = 100 + Math.cos(rad) * data.speed * 4;
    const endY = 700 - Math.sin(rad) * data.speed * 4;
    this.tweens.add({
      targets: this.projectile,
      x: endX,
      y: endY,
      duration: 1000,
    });
  }
}
