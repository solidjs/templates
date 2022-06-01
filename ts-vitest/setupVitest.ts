import {expect} from "vitest";
// @ts-ignore
import matchers from "@testing-library/jest-dom/dist/matchers";
import {TestingLibraryMatchers} from "@testing-library/jest-dom/matchers"

declare global {
    namespace Vi {
        interface Assertion extends TestingLibraryMatchers<any, void> {}
        interface AsymmetricMatchersContaining extends TestingLibraryMatchers<any, void> {}
    }
}

expect.extend(matchers)