<script lang="ts">
  import LoginForm from '../../components/screens/LoginForm.svelte';
  import { checkAuth } from '../../scripts/login';
  import { onMount } from 'svelte';

  onMount(() => {
    checkAuth(); // Auto-login if session exists
  });
</script>

<LoginForm />
