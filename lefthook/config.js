export const lefthookConfig = String.raw`pre-commit:
  parallel: true
  jobs:
    - name: html_ts
      glob: '*.{html,ts}'
      stage_fixed: true
      group:
        piped: true
        jobs:
          - run: npx eslint --fix {staged_files}
          - run: npx prettier --write {staged_files}
    - name: scss
      glob: '*.scss'
      stage_fixed: true
      group:
        piped: true
        jobs:
          - run: npx stylelint --fix {staged_files}
          - run: npx prettier --write {staged_files}
    - name: rest
      exclude: '*.{html,ts,scss}'
      stage_fixed: true
      run: npx prettier --write --ignore-unknown {staged_files}

pre-push:
  jobs:
    - name: test
      run: npm test`;
