<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { getFlash } from 'sveltekit-flash-message';
  import Icon from '@iconify/svelte';

  const flash = getFlash(page);

  let display_button = false;

  if (browser) {
    if (!!$flash && Object.keys($flash).includes('clearable')) {
      display_button = $flash.clearable!;
    } else {
      display_button = true;
    }
  }

  $: if ($flash) {
    let timeout = $flash.timeout ?? 3500;
    if (timeout !== 0) {
      setTimeout(() => {
        $flash = undefined;
      }, timeout);
    }
  }

  function get_bg_class(): string {
    switch ($flash?.type) {
      case 'success':
        return 'bg-green-50';
      case 'error':
        return 'bg-red-50';
      case 'warning':
        return 'bg-yellow-50';
      default:
        return 'bg-blue-50';
    }
  }

  function get_text_class(): string {
    switch ($flash?.type) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'warning':
        return 'text-yellow-700';
      default:
        return 'text-blue-700';
    }
  }

  function get_icon_class(): string {
    switch ($flash?.type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  }

  function get_border_class(): string {
    switch ($flash?.type) {
      case 'success':
        return 'border-green-400';
      case 'error':
        return 'border-red-400';
      case 'warning':
        return 'border-yellow-400';
      default:
        return 'border-blue-400';
    }
  }

  function get_icon(): string {
    switch ($flash?.type) {
      case 'success':
        return 'heroicons:check-circle-solid';
      case 'error':
        return 'heroicons:x-circle-solid';
      case 'warning':
        return 'heroicons:exclamation-triangle-solid';
      default:
        return 'heroicons:information-circle-solid';
    }
  }

  function get_dismiss_class(): string {
    switch ($flash?.type) {
      case 'success':
        return 'text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50 bg-green-50';
      case 'error':
        return 'text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50 bg-red-50';
      case 'warning':
        return 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50 bg-yellow-50';
      default:
        return 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50 bg-blue-50';
    }
  }

  function get_title() {
    if ($flash?.title) return $flash.title;
    switch ($flash?.type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      default:
        return '';
    }
  }

  function get_title_class() {
    switch ($flash?.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      default:
        return 'text-blue-800';
    }
  }
</script>

{#if $flash}
  <div
    class="mx-auto rounded-md p-4 absolute bottom-0 z-20 inset-x-0 w-[98vw] border sm:w-[95vw] md:w-3/4 max-w-2xl {get_bg_class()} {get_border_class()}"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <Icon icon={get_icon()} class="h-5 w-5 {get_icon_class()}" />
      </div>
      <div class="ml-3">
        {#if get_title()}
          <h5 class="text-medium font-semibold {get_title_class()}">{get_title()}</h5>
        {/if}
        <div class="text-sm {get_text_class()}">
          <p>{$flash.message}</p>
        </div>
      </div>
      {#if display_button}
        <div class="ml-auto pl-3">
          <div class="-mx-1.5 -my-1.5">
            <button
              type="button"
              class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 {get_dismiss_class()}"
              on:click={() => ($flash = undefined)}
            >
              <span class="sr-only">Dismiss</span>
              <Icon class="h-5 w-5" aria-hidden="true" icon="heroicons:x-mark" />
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}
