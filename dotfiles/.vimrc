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
Plug 'othree/html5.vim'
Plug 'Valloric/YouCompleteMe'

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
let g:syntastic_python_checkers=['pylint']
let g:syntastic_go_checkers=['go', 'golint', 'errcheck']
let g:syntastic_check_on_open = 1

" }}}
" vim-go {{{

let g:go_fmt_command = "goimports"

let g:go_highlight_functions = 1
let g:go_highlight_methods = 1
let g:go_highlight_structs = 1
let g:go_highlight_operators = 1
let g:go_highlight_build_constraints = 1

au Filetype go nnoremap <leader>v :vsp <CR>:exe "GoDef" <CR>

" }}}
" YouCompleteMe {{{

let g:ycm_autoclose_preview_window_after_insertion = 1
let g:ycm_autoclose_preview_window_after_completion = 1
let g:ycm_auto_trigger = 0

" }}}

