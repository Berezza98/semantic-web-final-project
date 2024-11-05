import ora, { Ora } from "ora";
import { ILoader } from "./interfaces";

class Loader implements ILoader {
  spinner: Ora | null = null;

  show() {
    if (this.spinner) return;

    this.spinner = ora('Loading...').start();
  }

  hide() {
    if (!this.spinner) return;

    this.spinner.stop();
  }
}

export const loader = new Loader();