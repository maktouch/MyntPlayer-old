### Svelte

Pros:

- Transitions, in/out and animations in general are very easy and amazing.

Cons:

- Ecosystem still sucks (2019-12-30)
- Uses rollup instead of webpack, and some libraries that works on both server and client flat-out don't work. For example: `qrcode`. Works perfectly in frontend-react, but couldn't make it work with Svelte.
- Can't pass class unless you use another prop name like className <https://github.com/sveltejs/svelte/issues/2870>
  - Workaround: use `$$props`
  - When you pass the class, it doesn't pass the generated className, but the string as is.. so the styles are not transferred
    - Workaround: use global like `:global(.theClassName)`
- Can't pass unknown props <https://github.com/sveltejs/svelte/issues/2930>
  - Workaround: use `$$props`
