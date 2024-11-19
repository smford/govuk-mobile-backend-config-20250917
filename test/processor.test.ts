// eslint-disable-next-line n/no-unpublished-import
import {mock, instance, resetCalls, when, verify, anything} from '@typestrong/ts-mockito';
import {FileHandler} from '../src/file-handler';
import {BuildOperation, GenerateOperation, ValidateOperation} from '../src/processor';
import {Validator} from '../src/validator';
import {ValidationResult} from '../src/validator/validation-result';
import {ConfigVersionDocument} from './utils/version-document';
import {Transformer} from '../src/transformer';
import {MockCvdValidator, MockTransformer} from './utils/mocks';
import {ConfigVersionDocumentBundle} from '../src/types/config-version-document';

const dummyFilename = './my-files/0.1.2.yaml';

const fileHandler: FileHandler = mock(FileHandler);
const cvdValidator: Validator<ConfigVersionDocumentBundle> = mock(MockCvdValidator);
const transformer: Transformer = mock(MockTransformer);

describe('ValidateOperation', () => {
  let op: ValidateOperation;
  beforeEach(() => {
    resetCalls(fileHandler);
    resetCalls(cvdValidator);
    op = new ValidateOperation(
      {
        filename: dummyFilename,
      },
      instance(fileHandler),
      instance(cvdValidator)
    );
  });

  it('completes without error when config is valid', () => {
    when(fileHandler.extractVersionFromFilename(dummyFilename)).thenReturn('0.1.2');
    when(fileHandler.loadDocument(dummyFilename)).thenReturn(ConfigVersionDocument.VALID);
    when(cvdValidator.validate(anything())).thenReturn(new ValidationResult());
    op.run();
    verify(cvdValidator.validate(anything())).once();
  });

  it('throws an error when config is not valid', () => {
    const invalidConfigResult = new ValidationResult();
    invalidConfigResult.putError('config is actually a banana');
    when(fileHandler.extractVersionFromFilename(dummyFilename)).thenReturn('0.1.2');
    when(fileHandler.loadDocument(dummyFilename)).thenReturn(ConfigVersionDocument.VALID);
    when(cvdValidator.validate(anything())).thenReturn(invalidConfigResult);
    expect(() => {
      op.run();
    }).toThrow('config is actually a banana');
  });
});

describe('GenerateOperation', () => {
  let op: GenerateOperation;
  beforeEach(() => {
    resetCalls(fileHandler);
    resetCalls(transformer);
    op = new GenerateOperation(
      {
        filename: dummyFilename,
      },
      instance(fileHandler),
      instance(transformer)
    );
  });

  it('calls transform with the correct object', () => {
    when(fileHandler.loadDocument(dummyFilename)).thenReturn(ConfigVersionDocument.VALID);
    when(transformer.transform(ConfigVersionDocument.VALID)).thenReturn({});
    op.run();
    verify(transformer.transform(ConfigVersionDocument.VALID)).once();
  });
});

describe('BuildOperation', () => {
  let op: BuildOperation;
  beforeEach(() => {
    resetCalls(fileHandler);
    resetCalls(transformer);
    op = new BuildOperation(
      {
        environment: 'integration',
        inputDirectory: '',
        outputDirectory: '',
      },
      instance(fileHandler),
      instance(transformer)
    );
  });

  it('correctly loads each of the specified files', async () => {
    when(fileHandler.buildTree()).thenReturn({'path-1': '1.1.1.toml', 'path-2': '2.2.2.toml'});
    when(fileHandler.loadDocument(anything())).thenReturn(ConfigVersionDocument.VALID);
    when(transformer.transform(anything())).thenReturn({integration: {}});
    await op.run();
    verify(fileHandler.loadDocument('1.1.1.toml', 'path-1')).once();
    verify(fileHandler.loadDocument('2.2.2.toml', 'path-2')).once();
  });

  it('signs the config and writes the file with the signature', async () => {
    const fakeConfig = {ios: {cheese: 'beans'}};
    const fakeSignedConfig = {ios: {...fakeConfig.ios, signature: 'ABCDEF'}};
    when(fileHandler.buildTree()).thenReturn({'path-1': '1.1.1.toml', 'path-2': '2.2.2.toml'});
    when(fileHandler.loadDocument(anything())).thenReturn(ConfigVersionDocument.VALID);
    when(transformer.transform(anything())).thenReturn({integration: fakeConfig});
    await op.run();
    verify(fileHandler.writeTree('path-1', fakeSignedConfig));
    verify(fileHandler.writeTree('path-2', fakeSignedConfig));
  });
});
