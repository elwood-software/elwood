if (import.meta.main) {
  main();
}

export async function main() {
  const src = Deno.env.get('INPUT_SRC');
  const dest = Deno.env.get('INPUT_DEST');

  console.log(src, dest);
}
