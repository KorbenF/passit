import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'coverage/**',
      '.agents/**',
      'scripts/not-configured.mjs',
    ],
  },
  {
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: 'error',
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    plugins: {
      'jsx-a11y': jsxA11y,
      '@eslint-community/eslint-comments': eslintComments,
    },
    rules: {
      // TypeScript strict rules enforced by AGENTS.md
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': true,
          'ts-ignore': true,
          'ts-nocheck': true,
          'ts-check': false,
          minimumDescriptionLength: 0,
        },
      ],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'never',
        },
      ],

      // Disallow .only and .skip in tests
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'MemberExpression[object.name=/(describe|it|test)/][property.name=/(only|skip)/]',
          message:
            'describe.only/skip and test.only/skip are forbidden (AGENTS.md section 5)',
        },
      ],

      // ESLint comments rule
      '@eslint-community/eslint-comments/no-use': [
        'error',
        {
          allow: [],
        },
      ],
    },
  },
  // Restrict server-only imports in client files
  {
    files: ['src/**'],
    ignores: ['src/lib/server/**', 'src/pages/api/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/lib/server/**', 'astro:env/server'],
              message:
                'Server code cannot be imported into client files (AGENTS.md section 4).',
            },
          ],
        },
      ],
    },
  },
  // Astro specific rules
  {
    files: ['**/*.astro'],
    rules: {
      'astro/no-set-html-directive': 'error',
    },
  },
  // Type declaration files
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
  // Exception for JsonLd.astro (AGENTS.md section 4.2)
  {
    files: ['src/components/seo/JsonLd.astro'],
    rules: {
      'astro/no-set-html-directive': 'off',
    },
  }
);
