export const lefthookConfig = String.raw`pre-commit:
  parallel: true
  jobs:
    - name: html_ts
      glob: '*.{html,ts}'
      group:
        piped: true
        jobs:
          - run: npx eslint --fix {staged_files}
            stage_fixed: true
          - run: npx prettier --write {staged_files}
            stage_fixed: true
    - name: scss
      glob: '*.scss'
      group:
        piped: true
        jobs:
          - run: npx stylelint --fix {staged_files}
            stage_fixed: true
          - run: npx prettier --write {staged_files}
            stage_fixed: true
    - name: rest
      exclude: '*.{html,ts,scss}'
      stage_fixed: true
      run: npx prettier --write --ignore-unknown {staged_files}

pre-push:
  jobs:
    - name: test
      run: npm test`;
