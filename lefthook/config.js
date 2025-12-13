export const lefthookConfig = String.raw`pre-commit:
  parallel: true
  commands:
    html_ts:
      glob: '*.{html,ts}'
      run: npx eslint --fix {staged_files} && npx prettier --write {staged_files}
      stage_fixed: true
    scss:
      glob: '*.scss'
      run: npx stylelint --fix {staged_files} && npx prettier --write {staged_files}
      stage_fixed: true
    rest:
      exclude: '*.{html,ts,scss}'
      run: npx prettier --write --ignore-unknown {staged_files}
      stage_fixed: true

pre-push:
  commands:
    test:
      run: npm test -- --browsers ChromeHeadless --watch false`;
