import {isReadOnly, readonly} from '../reactive'
describe("reactive", () => {
  it("happy path", () => {
    // no set
    const orginal = {foo: 1}
    const bar = {bar: 2}
    const wrapped = readonly(orginal)

    expect(wrapped).not.toBe(orginal)
    expect(isReadOnly(wrapped)).toBe(true)
    expect(isReadOnly(orginal)).toBe(false)
    expect(orginal.foo).toBe(1)
  }) // set 警告
  it('warn then call set', () => {
    console.warn = jest.fn()
    const user = readonly({
      age: 10,
    })
    user.age++;
    expect(console.warn).toBeCalled()
  })
})