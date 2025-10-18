const extractInitials = (str: string) =>
  str?str
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w: string) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join(''):""

export default extractInitials;
