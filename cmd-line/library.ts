export class DataLib {
  public static drill(f, o, n = 0, ...xs) {
    if (n >= f.t.length) { f.last(...xs.reverse()); return }
    if (o) Object.keys(o).forEach((p, i) =>
      this.drill(f, f.t[n](o[p]), n + 1, ...xs, i, p, ...f.e[n](o[p])))
  }

  public static n2s(n: number) {
    return ('0' + n).slice(-2);
  }

  public static n9(d: string) {
    if (d === '-') return d
    else return 9 - (+d)
  }

  public static d2rev(d: string) {
    let dd = []
    d.split('').forEach(c => dd.push(this.n9(c)));
    return dd.join('')
  }

}
