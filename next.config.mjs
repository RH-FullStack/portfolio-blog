const isDev = process.argv.indexOf('dev') !== -1
const isBuild = process.argv.indexOf('build') !== -1
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1'
  const { build } = await import('velite')
  // strict: true — malformed frontmatter must fail the build (T-02-01), not
  // silently exclude the post. Velite's build() defaults strict to false.
  await build({ watch: isDev, clean: !isDev, strict: true })
}

/** @type {import('next').NextConfig} */
export default {}
