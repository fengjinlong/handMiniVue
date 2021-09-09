import {reactive} from '../reactive';
import {effect} from '../effect';
describe("effect", () => {
  it("happy 1path", () => {
    const user = reactive({
      age: 10
    })
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;

    })
    expect(nextAge).toBe(11);
    // update
    user.age++;
    expect(nextAge).toBe(12)
  })

  it("should return runner when call effect", () => {
    let foo = 10;
    let runner = effect(() => {
      foo++;
    })
    expect(foo).toBe(11)
    let r = runner()
  expect(foo).toBe(12)
  })

  it("scheduler", () => {
    let dummy;
    let run:any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({foo: 1})
    const runner = effect(() => {
      dummy = obj.foo;
    }, {
      scheduler
    })
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)

    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)
    run();
    expect(dummy).toBe(2)
  })
})