import { computed } from '../computed'
import { reactive } from '../reactive'

describe('computed', () => {
  it('happy path', () => {
    // ref .value 缓存
    const user = reactive({
      age: 1,
    })

    const age = computed(() => {
      return user.age
    })

    expect(age.value).toBe(1)
  })
  it('should computed lazily', () => {
    const value = reactive(() => {
      foo: 1
    })
    const getter = jest.fn(() => {
      return value.foo
    })
    const cValue = computed(getter)

    // lazy
    expect(getter).not.toHaveBeenCalled()
    // expect((cValue.value)).toBe(1)
    expect(getter).toHaveBeenCalledTimes(0)

    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1)
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1)

    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)

    // now it should computed
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

    // sgould not computed again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2)
  })
})
