app "hello"
    packages { pf: "https://github.com" }
    imports [pf.Stdout]
    provides main to pf

## This is docs
## for main.roc file

# this is a test

Musician : { firstName : Str, lastName : Str }

amy : Musician
amy = { firstName: "Amy", lastName: "Lee" }

_asd = 123

demo =
  .qsasd

task : a -> Int -> Str.Int.asd -> Foo.Bar -> a
task =
    _ <- await (Stdout.line "Type something press Enter:")
    text <- await Stdin.line

    Stdout.line "You just entered: \(text)"

x = 3
y = 3.2

when myList is
    [] -> 0 # the list is empty
    [Foo, ..] -> 1 # it starts with a Foo tag
    [_, ..] -> 2 # it contains at least one element, which we ignore
    [Foo, Bar, ..] -> 3 # it starts with a Foo tag followed by a Bar tag
    [Foo, Bar, Baz] -> 4 # it has exactly 3 elements: Foo, Bar, and Baz
    [Foo, a, ..] -> 5 # its first element is Foo, and its second we name `a`
    [Ok a, ..] -> 6 # it starts with an Ok containing a payload named `a`
    [.., Foo] -> 7 # it ends with a Foo tag
    [A, B, .., C, D] -> 8 # it has certain elements at the beginning and end

addAndStringify : Int -> Int -> Str
addAndStringify = \num1, num2 ->
    sum = num1 + num2

    dbg sum

    if sum == 0 then
        ""
    else if sum < 0 then
        "negative"
    else
        Num.toStr (num1 + num2)