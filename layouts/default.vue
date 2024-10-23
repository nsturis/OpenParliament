<template>
  <div>
    <UNavbar>
      <UNavbarItem to="/">Home</UNavbarItem>
      <UNavbarItem to="/ugeplan">Ugeplan</UNavbarItem>
      <UNavbarItem to="/sag">Sag</UNavbarItem>
      <UNavbarItem to="/test-api">Test API</UNavbarItem>
    </UNavbar>
    <slot />
  </div>
</template>
