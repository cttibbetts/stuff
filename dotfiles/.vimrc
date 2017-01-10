" 1 important {{{
call plug#begin('~/.vim/plugged')

Plug 'fatih/vim-go'
Plug 'itchyny/lightline.vim'
Plug 'Shougo/unite.vim'
Plug 'airblade/vim-gitgutter'
Plug 'Yggdroot/indentLine'
Plug 'bogado/file-line'
Plug 'vim-polyglot'
Plug 'osyo-manga/vim-brightest'
Plug 'vim-syntastic/syntastic'

call plug#end()
" }}}
" 2 moving around, searching, and patterns {{{

set clipboard=unnamed

set showmatch
set mat=2

" }}}
" 3 tags {{{
" }}}
" 4 displaying text {{{

set number

" }}}
" 5 syntax, highlighting, and spelling {{{
" }}}
" 6 multiple windows {{{
" }}}
" 7 multiple tab pages {{{
" }}}
" 8 terminal {{{
" }}}
" 9 using the mouse {{{

set mouse=a

" }}}
" 10 GUI {{{
" }}}
" 11 printing {{{
" }}}
" 12 messages and info {{{

set noerrorbells
set novisualbell

" }}}
" 13 selecting text {{{
" }}}
" 14 editing text {{{
" }}}
" 15 tabs and indenting {{{
    set expandtab
    set tabstop=4
    set shiftwidth=4
" }}}
" 16 folding {{{
" }}}
" 17 diff mode {{{
" }}}
" 18 mapping {{{

" center after going to next word
nnoremap n nzz
nnoremap N Nzz

" maintain selection after indenting
xnoremap < <gv
xnoremap > >gv

" }}}
" 19 reading and writing files {{{
" }}}
" 20 the swap file {{{
" }}}
" 21 command line editing {{{
" }}}
" 22 executing external commands {{{
" }}}
" 23 running make and jumping to errors {{{
" }}}
" 24 language specific {{{
" }}}
" 25 multi-byte characters {{{
" }}}
" 26 various {{{

" :W sudo saves the file
" (useful for handling the permission denied error)
command! W w !sudo tee % > /dev/null

autocmd BufReadPost *
    \ if line("'\"") > 0 && line("'\"") <= line("$") |
    \   exe "normal! g`\"" |
    \ endif

" }}}
" lightline {{{

let g:lightline = {
    \ 'colorscheme': 'wombat',
    \ 'component': {
    \   'readonly': '%{&readonly?"⭤":""}',
    \ },
    \ 'separator': { 'left': '⮀', 'right': '⮂' },
    \ 'subseparator': { 'left': '⮁', 'right': '⮃' }
\ }
set laststatus=2

" }}}
" unite {{{

call unite#filters#matcher_default#use(['matcher-fuzzy'])
call unite#filters#sorter_default#use(['sorter-rank'])

" }}}
" syntastic {{{

let g:syntastic_javascript_checkers = ['eslint']
let g:syntastic_check_on_open = 1

" }}}

