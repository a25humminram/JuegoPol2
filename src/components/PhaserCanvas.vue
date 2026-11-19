<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Phaser from 'phaser';
import { MapScene } from '../game/MapScene';

const emit = defineEmits(['mapaCarregat']);
const contenidor = ref(null);
let game = null;

onMounted(() => {
  game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 640, height: 480,
    backgroundColor: '#0f172a',
    pixelArt: true,
    parent: contenidor.value,
    scene: [MapScene]
  });

  game.events.on('mapa-carregat', (elements) => {
    emit('mapaCarregat', elements);
  });
});

onUnmounted(() => game?.destroy(true));
</script>

<template><div ref="contenidor"></div></template>
