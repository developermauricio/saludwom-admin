<template>
  <div class="calendar-menu" v-show="isMenuVisible">
    <ul>
      <li @click="changeView('dayGridMonth')">Mes</li>
      <li @click="changeView('timeGridWeek')">Semana</li>
      <li @click="changeView('timeGridDay')">Día</li>
      <li @click="changeView('multiMonthYear')">Año</li>
      <li @click="changeView('listWeek')">Agenda</li>
    </ul>
  </div>
</template>


<script>
export default {
  name: "CalendarMenu",
  props: {
    isMenuVisible: Boolean,
    changeView: Function
  }
}
</script>

<style scoped>
.calendar-menu {
  position: absolute;
  top: 100%;
  left: 0;
  display: none;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.calendar-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.calendar-menu li {
  padding: 8px 16px;
  cursor: pointer;
}
</style>
