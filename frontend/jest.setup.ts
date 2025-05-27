// Basic setup to mock any needed modules — avoid deep internal imports
import "jest-expo";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));
