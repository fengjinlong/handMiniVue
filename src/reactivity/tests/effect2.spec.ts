import {reactive, isReactive} from '../reactive'

describe("reactive", () => {
  it("happy path", () => {
    const orginal = {foo: 1}
    const observed = reactive(orginal)
    expect(observed.foo).toBe(1)

  })
})