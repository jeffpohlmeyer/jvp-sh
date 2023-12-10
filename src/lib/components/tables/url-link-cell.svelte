<script lang="ts">
  export let url: string;
  export let href: string = `${url}+`;
  export let target: string = '_self';
  export let rel: string = 'noopener noreferrer';
</script>

<a {href} {target} {rel}>{url}</a>
