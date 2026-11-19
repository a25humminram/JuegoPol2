import Phaser from 'phaser';

export class MapScene extends Phaser.Scene {
  constructor() { super('MapScene'); }

  preload() {
    this.load.image('tiles_oficina', '/assets/tileset.png');
    this.load.tilemapTiledJSON('mapa_oficina', '/assets/mapa.json');
  }

  create() {
    const map = this.make.tilemap({ key: 'mapa_oficina' });
    const tileset = map.addTilesetImage('tileset_tiled', 'tiles_oficina');
    if (!tileset) { console.error('Error: revisa el nom tileset_tiled'); return; }

    map.createLayer('Terra', tileset, 0, 0);
    map.createLayer('Mobles', tileset, 0, 0); // Reto 1: capa Mobles entre Terra y Parets
    const capaParets = map.createLayer('Parets', tileset, 0, 0);
    capaParets?.setCollisionByProperty({ collides: true });

    const elementsDetectats = [];
    const capaObjectes = map.getObjectLayer('Objectes');
    capaObjectes?.objects.forEach((obj) => {
      const props = this.obtenirPropietats(obj);
      const cx = obj.x + (obj.width || 0) / 2;
      const cy = obj.y + (obj.height || 0) / 2;

      if (props.tipus === 'spawn') {
        this.avatar = this.add.circle(cx, cy, 14, 0x10b981).setStrokeStyle(2, 0xffffff);
      }
      if (props.tipus === 'zona') {
        this.add.rectangle(cx, cy, obj.width, obj.height, 0x10b981, 0.22).setStrokeStyle(2, 0x10b981);
        this.add.text(cx, cy, props.nomSala || 'Zona', { fontSize: '13px', color: '#a7f3d0' }).setOrigin(0.5);
        // Reto 3: añadimos el aforament
        elementsDetectats.push({ tipus: 'Zona', nom: props.nomSala || 'Sense nom', aforament: props.aforament || 0 });
      }
      if (props.tipus === 'monitor') {
        this.add.rectangle(cx, cy, 28, 20, 0xf59e0b).setStrokeStyle(2, 0xffffff);
        this.add.text(cx, cy - 18, props.titol || 'Monitor', { fontSize: '12px', color: '#fde68a' }).setOrigin(0.5);
        elementsDetectats.push({ tipus: 'Monitor', nom: props.titol || 'Pantalla' });
      }
    });

    this.avatar?.setDepth(10);
    this.game.events.emit('mapa-carregat', elementsDetectats);
  }

  obtenirPropietats(obj) {
    const resultat = {};
    (obj.properties || []).forEach((p) => { resultat[p.name] = p.value; });
    return resultat;
  }
}
