import babelRegister from 'babel-core/register';

babelRegister({
    ignore: /node_modules\/(?!reflecti)/
});
