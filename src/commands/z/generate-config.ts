import { sys } from 'typescript';
import { BridgeCommand } from '../../base';
import { Config } from '../../config';

class StringBuilder {
  data: string[];

  nonce: number;

  constructor() {
    this.data = [];
    this.nonce = 0;
  }

  write(chunk: string) {
    this.data.push(chunk);
  }

  writeLine(chunk: string) {
    this.write(chunk);
    this.write('\n');
  }

  bump() {
    this.nonce += 1;
  }

  get value(): string {
    return this.data.join('');
  }
}

function toCamelCase(input: string) {
  return input
    .replace('-', '_')
    .replace(' ', '_')
    .split('_')
    .reduce(
      (res, word, i) =>
        i === 0
          ? word.toLowerCase()
          : `${res}${word.charAt(0).toUpperCase()}${word
              .substr(1)
              .toLowerCase()}`,
      ''
    );
}

export default class GenerateConfig extends BridgeCommand {
  static description =
    'Generate config/base.ts file from yml file automatically';

  static flags = {
    ...BridgeCommand.flags
  };

  static args = [
    ...BridgeCommand.args,
    { name: 'file', required: true, default: '' }
  ];

  async run(): Promise<void> {
    const content = await Config.loadConfigRaw(this.args.file);
    const builder = new StringBuilder();
    generate(content, builder);
    sys.write(builder.value);
  }
}

function generate(
  content: any,
  builder: StringBuilder,
  name = 'GConfig',
  writePrefix = true
) {
  if (writePrefix) {
    builder.write(`/// This code was generated automatically.
/// DO NOT EDIT
///
/// Regenerate it with:
/// bridge z:generate-config ~/.rainbow/ropsten/config.yml > config/base.ts
import * as assert from 'assert';

class BaseConfig {
  config: any;

  constructor(config: unknown) {
    this.config = config;
  }

  has(key: string, type = '') {
    assert.ok(
      key in this.config,
      \`Error: Key \${key} not found in \${this.config}\`
    );

    if (type !== '') {
      assert.strictEqual(
        typeof this.config[key],
        type,
        \`Error: Key \${key}. Expected type \${type}. Found \${typeof this.config[
          key
        ]}\`
      );
    }
  }
}
`);
  }

  const classNames = [];

  for (const key in content) {
    if (Object.prototype.hasOwnProperty.call(content, key)) {
      switch (typeof content[key]) {
        case 'object':
          classNames.push(generate(content[key], builder, key, false));
          break;
        case 'string':
          break;
        case 'number':
          break;
        default:
          throw new Error(
            `Type not supported typeof(key) = ${typeof content[key]}`
          );
      }
    }
  }

  classNames.reverse();

  builder.bump();

  let className;

  if (writePrefix) {
    builder.write(`export default class ${name} extends BaseConfig {`);
  } else {
    className = `${toCamelCase(name)}${builder.nonce}`;
    builder.write(`export class ${className} extends BaseConfig {`);
  }

  for (const key in content) {
    if (Object.prototype.hasOwnProperty.call(content, key)) {
      const type = typeof content[key];
      const keyName = toCamelCase(key);
      switch (type) {
        case 'object': {
          const currClassName = classNames[classNames.length - 1];

          builder.write(`
  get ${keyName}(): ${currClassName} {
    this.has('${key}');
    return new ${currClassName}(this.config.${key});
  }
`);
          classNames.pop();
          break;
        }
        default: {
          builder.write(`
  get ${keyName}(): ${type} {
    this.has('${key}', '${type}');
    return this.config.${key};
  }
`);
          break;
        }
      }
    }
  }

  builder.write(`}
`);

  return className;
}
