<template>
  <aside class="sidebar">
    <h2>SmartLearn</h2>
    <nav>
      <ul>
        <li><router-link to="/">Dashboard</router-link></li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
}
.sidebar h2 {
  margin-top: 0;
  text-align: center;
}
.sidebar nav ul {
  list-style: none;
  padding: 0;
}
.sidebar nav ul li {
  margin-bottom: 10px;
}
.sidebar nav ul li a {
  color: white;
  text-decoration: none;
  display: block;
  padding: 10px;
  border-radius: 4px;
}
.sidebar nav ul li a:hover {
  background-color: #34495e;
}
</style>
