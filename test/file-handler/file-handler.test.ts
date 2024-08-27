import {FileHandler} from '../../src/file-handler';

const fileHandler = new FileHandler({
  inputDirectory: '',
  outputDirectory: '',
  fileExtension: '.yaml',
});

function randomSemver(): String {
  const version = Array(3).fill(0);
  version.forEach((_, i) => {
    version[i] = (Math.random() * 10) | 0;
  });
  return version.join('.');
}

describe('FileHandler#extractVersionFromFilename', () => {
  it('extracts a basic version number from a filename', () => {
    const version = randomSemver();
    const filename = `/path/to/file/${version}.yaml`;
    const res = fileHandler.extractVersionFromFilename(filename);
    expect(res).toEqual(version);
  });

  it('extracts a basic version number from a filename with a yml extension', () => {
    const version = randomSemver();
    const ymlHandler = new FileHandler({
      inputDirectory: '',
      outputDirectory: '',
      fileExtension: '.yml',
    });
    const filename = `/path/to/file/${version}.yml`;
    const res = ymlHandler.extractVersionFromFilename(filename);
    expect(res).toEqual(version);
  });

  it('also works with toml', () => {
    const tomlHandler = new FileHandler({
      inputDirectory: '',
      outputDirectory: '',
      fileExtension: '.toml',
    });
    const filename = '/path/to/file/7.6.1.toml';
    const res = tomlHandler.extractVersionFromFilename(filename);
    expect(res).toEqual('7.6.1');
  });

  it('extracts a version number with additional details from a filename', () => {
    const version = randomSemver();
    const filename = `/path/to/file/${version}+rc2.yaml`;
    const res = fileHandler.extractVersionFromFilename(filename);
    expect(res).toEqual(`${version}+rc2`);
  });

  it('extracts a version number even with no file extension', () => {
    const version = randomSemver();
    const filename = `/path/to/file/${version}`;
    const res = fileHandler.extractVersionFromFilename(filename);
    expect(res).toEqual(version);
  });

  it('extracts version number from a relative path', () => {
    const version = randomSemver();
    const filename = `./files/${version}.yaml`;
    const res = fileHandler.extractVersionFromFilename(filename);
    expect(res).toEqual(version);
  });

  it('extracts version number from a relative path with no extension', () => {
    const version = randomSemver();
    const filename = `./files/${version}`;
    const res = fileHandler.extractVersionFromFilename(filename);
    expect(res).toEqual(version);
  });

  it('extracts version number from a filename with no path', () => {
    const version = randomSemver();
    const filename = `${version}.yaml`;
    const res = fileHandler.extractVersionFromFilename(filename);
    expect(res).toEqual(version);
  });

  it('extracts version number from a filename with no path and no extension', () => {
    const version = randomSemver();
    const filename = `${version}`;
    const res = fileHandler.extractVersionFromFilename(filename);
    expect(res).toEqual(version);
  });

  it('extracts complex version number from a filename with no path', () => {
    const version = randomSemver();
    const filename = `${version}+rc3.yaml`;
    const res = fileHandler.extractVersionFromFilename(filename);
    expect(res).toEqual(`${version}+rc3`);
  });
});
