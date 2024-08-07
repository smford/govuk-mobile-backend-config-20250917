import {FileHandler} from './file-handler';
import {Transformer} from './transformer';
import {Validator} from './validator';

/**
 * This class is responsible for injecting dependencies and connecting the relevant
 * classes together, delegating requests to the correct place.
 */

export class Processor {
  validate(filename: string) {
    const fileHandler = new FileHandler();
    const validator = new Validator();

    const versionDocument = fileHandler.loadYaml(filename);
    const versionString = fileHandler.extractVersionFromFilename(filename);
    const result = validator.validateVersionDocument(versionString, versionDocument);

    if (!result.isValid()) {
      throw result.getMessage();
    }
  }

  generate(filename: string) {
    this.validate(filename);
    const fileHandler = new FileHandler();
    const transformer = new Transformer();

    const versionDocument = fileHandler.loadYaml(filename);
    const versionString = fileHandler.extractVersionFromFilename(filename);
    const output = transformer.transform(versionString, versionDocument);

    console.log(JSON.stringify(output, null, 2));
  }
}
