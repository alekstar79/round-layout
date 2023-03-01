<template>
  <div class="hero-bg" :style="{ backgroundImage: `url(${active.img})` }" :key="activeIndex" />

  <div class="hero-title" :key="activeIndex">{{ active.name }}</div>

  <div class="round">
    <div
      class="item"
      v-for="(el, key) in list"
      @click="activeIndex = key"
      :class="{ active: activeIndex === key }"
      :style="{ transform: itemPosition[key] }"
      :key="key"
    >
      <div class="inner">
        <img :src="el.thumb" alt="">
      </div>
    </div>
  </div>

  <div class="hero-info" v-if="active" :key="activeIndex">
    <div class="row">
      <div class="title">name</div>
      <div class="content">{{ active.name }}</div>
    </div>

    <div class="row">
      <div class="title">description</div>
      <div class="content desc">{{ active.desc }}</div>
    </div>
  </div>

  <div class="fullscreen-icon" @click="toggleFullScreen">
    <span v-for="i in 4" :key="i"></span>
  </div>
</template>

<script setup>
import { computed, ref, watch /*, onMounted */ } from 'vue'
import { usePixi } from '@/use/pixi'
import { list } from '@/assets/list'

const isFullscreen = ref(false)
const activeIndex = ref(0)
const wrapper = ref(null)

const active = computed(() => list[activeIndex.value])

const itemPosition = computed(() => {
  return list.map((_, key) => {
    const deg = 360 / list.length * key - 90

    return `rotate(${deg}deg) translate(2rem) rotate(${-deg}deg)`
  })
})

function toggleFullScreen()
{
  const el = document.documentElement

  if (!isFullscreen.value) {
    if (el.requestFullscreen) {
      el.requestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }

  isFullscreen.value = !isFullscreen.value
}

// onMounted(setup)
// eslint-disable-next-line no-unused-vars
function setup()
{
  // const node = document.getElementById('app')
  const { app, loadAssets } = usePixi({
    height: wrapper.value.clientHeight,
    width: wrapper.value.clientWidth,
    resizeTo: window,
    antialias: true,
    active
  })

  // app.view.classList.add('hero-bg')
  wrapper.value.insertAdjacentElement('afterbegin', app.view)
  window.addEventListener('resize', resize)
  watch(() => isFullscreen.value, resize)

  loadAssets(list)

  function resize()
  {
    app.resize()
    app.render()
  }
}
</script>

<!--suppress CssUnknownTarget -->
<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Ovo&display=swap');

$main-color: #c18f2b;
$light-color: #09c3e2;

* {
  box-sizing: border-box;
}

html {
  font-size: 100vmax / 1600 * 100;
  @media (max-width: 992px) {
    font-size: 100vmax / 992 * 100;
  }
}

body {
  position: relative;
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  background-image: repeating-linear-gradient(-45deg, #111 20%, #4b6b71 40%, #111 60%);
  font-size: .18rem;
  font-family: 'Ovo', serif;
  overflow: hidden;
}

#app {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 50% 50%;
  justify-items: center;
  align-items: center;
  overflow: auto;
  padding: .6rem;
  @media (max-width: 992px) {
    grid-template-columns: 100%;
    row-gap: 1rem;
  }
}

.hero-bg {
  position: fixed;
  right: 0;
  top: 0;
  width: 85%;
  height: 100%;
  background: no-repeat top center / cover;
  mask: linear-gradient(to right, transparent, #000 50%);
  animation: fadeInFromRight .8s both;
}

.hero-title {
  position: absolute;
  left: .3rem;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;

  text-transform: uppercase;
  font-size: 1.9rem;
  color: rgba(#fff, .5);
  mix-blend-mode: overlay;
  animation: blurFadeIn .6s both;
  text-shadow: 0 0 24px #000;
  @media (max-width: 992px) {
    top: 2rem;
    bottom: auto;
  }
}

.round {
  position: relative;
  width: 5rem;
  height: 5rem;
  flex-shrink: 0;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 4rem;
    height: 4rem;
    margin: auto;
    border-radius: 50%;
    border-top: 5px solid $main-color;
    animation: rotate 5s .2s both linear infinite;
  }

  $item-size: .8rem;
  .item {
    position: absolute;
    top: 50%;
    left: 50%;
    animation: roundItemFadeIn .8s .2s both;
    &.active .inner {
      box-shadow: 0.05rem 0.05rem 0.2rem rgba(#000, .5);
      transform: translate(-50%, -50%) scale(1.2);
      &:after {
        width: 20%;
        height: 20%;
        opacity: 1;
      }
    }
  }
  .inner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: $item-size;
    height: $item-size;

    border-radius: 50%;
    box-shadow: .05rem .05rem .1rem rgba(#000, .7);
    cursor: pointer;
    transition: all .3s;
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 110%;
      height: 110%;
      border-radius: inherit;
      background-color: $main-color;
      opacity: 0.25;
      transition: all .3s;
    }
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }
}

.hero-info {
  width: 4rem;
  padding: .2rem;
  flex-shrink: 0;

  border-radius: .2rem;
  backdrop-filter: blur(8px);
  background-color: rgba(#000, .4);
  box-shadow: 0 0 0.1rem rgba(#000, .7);
  text-shadow: 0 0 2px #555;
  @media (max-width: 992px) {
    width: 100%;
  }

  .row {
    margin-bottom: .1rem;
    animation: fadeInFromTop .5s both;
    @for $i from 1 through 4 {
      &:nth-of-type(#{$i}) {
        animation-delay: ($i - 1) * .25s;
      }
    }
  }
  .title {
    font-size: 1.1em;
    font-weight: bold;
    text-transform: uppercase;
    color: $light-color;
    &:before {
      content: '# ';
    }
  }
  .content {
    color: #ccc;
    &.desc {
      font-size: .9em;
      line-height: 1.2;
    }
  }
}

.fullscreen-icon {
  position: fixed;
  top: .2rem;
  left: .2rem;
  width: .3rem;
  height: .3rem;

  opacity: 0.8;
  background: linear-gradient(#fff, #fff) no-repeat center / 50% 50%;
  cursor: pointer;
  @media (max-width: 992px) {
    display: none;
  }

  span {
    position: absolute;
    width: 30%;
    height: 30%;
    border-style: solid;
    border-color: #fff;
    border-width: .03rem .03rem 0 0;
    &:nth-of-type(1) {
      top: 0;
      right: 0;
    }
    &:nth-of-type(2) {
      bottom: 0;
      right: 0;
      transform: rotate(90deg);
    }
    &:nth-of-type(3) {
      bottom: 0;
      left: 0;
      transform: rotate(180deg);
    }
    &:nth-of-type(4) {
      top: 0;
      left: 0;
      transform: rotate(-90deg);
    }
  }
}

@keyframes roundItemFadeIn {
  from {
    opacity: 0;
    transform: none;
  }
}
@keyframes fadeInFromTop {
  from {
    opacity: 0;
    transform: translateY(-.2rem);
  }
}
@keyframes fadeInFromRight {
  from {
    opacity: 0;
    transform: translateX(.5rem);
  }
}
@keyframes blurFadeIn {
  from {
    filter: blur(10px);
    letter-spacing: -.4rem;
  }
}
@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(.3);
  }
}
@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
