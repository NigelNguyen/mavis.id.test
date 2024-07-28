#

### Install
```
brew install llvm
export  AR=/usr/local/opt/llvm/bin/llvm-ar
export CC=/usr/local/opt/llvm/bin/clang
npm run build::wasm
npm run build
```

// TODO: remove wasm file from git when publish package
