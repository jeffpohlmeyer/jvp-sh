<script lang="ts">
  import '../app.pcss';

  import { page } from '$app/stores';
  import Footer from '$lib/components/Footer.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import { Button } from '$lib/components/ui/button';

  const errorInfo: { [key: number]: { title: string; text: string } } = {
    403: {
      title: 'Forbidden',
      text: "You're not allowed to access this page."
    },
    404: {
      title: 'Page not found',
      text: 'Please check the URL in the address bar and try again.'
    },
    500: {
      title: 'Ooops!!! Looks like something went wrong!',
      text: 'We track these errors automatically, but if the problem persists feel free to contact us. In the meantime, try refreshing.'
    }
  };

  function getErrorInfo() {
    return errorInfo[$page.status] || errorInfo[500];
  }

  function getDescriptionText() {
    return getErrorInfo()?.text || 'Something went wrong';
  }

  function getTitle() {
    return getErrorInfo()?.title || 'Error';
  }
</script>

<svelte:head>
  <title>Error | therabeez</title>
</svelte:head>

<main class="relative">
  <div class="mx-auto max-w-7xl px-6 pb-[189px] pt-8 sm:px-8 sm:pt-10 md:pt-12 lg:pb-[205px]">
    <div class="mx-auto h-full max-w-7xl justify-center px-4 pt-8 sm:px-6">
      <div
        class="mx-auto min-h-[300px] max-w-4xl overflow-hidden rounded-lg bg-secondary/50 px-4 py-6 shadow sm:mt-12 md:grid md:place-items-center lg:px-8"
      >
        <div class="mx-auto max-w-max">
          <div class="sm:flex">
            <p class="text-4xl font-extrabold text-primary sm:text-5xl">{$page.status}</p>
            <div class="sm:ml-6">
              <div class="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 class="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                  {getTitle()}
                </h1>
                <p class="text-primary-dark mt-1 text-base">
                  {getDescriptionText()}
                </p>
              </div>
              <div class="mt-10 flex space-x-3 sm:pl-6">
                <Button href="/" variant="link">Go back home</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
