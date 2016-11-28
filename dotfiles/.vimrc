set nocompatible
filetype off

call plug#begin('~/.vim/plugged')

Plug 'fatih/vim-go', {'tag': '*'}
Plug 'ctrlpvim/ctrlp.vim', {'tag': '*'}
Plug 'itchyny/lightline.vim', {'tag': '*'}

call plug#end()

filetype plugin indent on
set tabstop=4
set shiftwidth=4
set expandtab
filetype plugin indent on " required

set number

let g:lightline = {
    \ 'colorscheme': 'wombat',
    \ 'component': {
    \   'readonly': '%{&readonly?"⭤":""}',
    \ },
    \ 'separator': { 'left': '⮀', 'right': '⮂' },
    \ 'subseparator': { 'left': '⮁', 'right': '⮃' }
\ }

set laststatus=2

