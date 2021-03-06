import processConfig, { getDirResolver } from './process-config';

jest.mock('path');

describe('getDirResolver', () => {
    const mockDirname = 'mockDirname';

    beforeAll(() => {
        const { dirname, resolve } = require('path');

        dirname.mockImplementation((dirName: string) => {
            if (dirName === mockDirname) {
                return mockDirname;
            }
        });
        resolve.mockImplementation((dirName: string, dir: string) => {
            if (dirName === mockDirname) {
                return dir;
            }
        });
    });

    it('runs consmiconfig based on cwd', () => {
        const dirResolver = getDirResolver(mockDirname);

        expect(dirResolver('test')).toBe('test');
    });
});

describe('processConfig', () => {
    beforeAll(() => {
        const { resolve } = require('path');
        resolve.mockImplementation((_: string, dir: string) => 'resolved_' + dir);
    });

    it('populates root and rules', () => {
        const result = processConfig({
            config: {
                root: 'test',
            },
            filepath: '',
        });

        expect(result.root).toBe('resolved_test');
        expect(result.rules).toEqual({});
    });

    it('populates rulesDir', () => {
        const result = processConfig({
            config: {
                rulesDir: 'test',
            },
            filepath: '',
        });

        expect(result.rulesDir).toBe('resolved_test');
    });

    it('populates rules', () => {
        const rules = {};
        const result = processConfig({
            config: {
                rules,
            },
            filepath: '',
        });

        expect(result.rules).toBe(rules);
    });
});
