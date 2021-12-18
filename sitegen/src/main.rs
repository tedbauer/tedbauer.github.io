use std::fs::File;
use std::io::Write;
fn main() -> std::io::Result<()> {
    let index = b"<!DOCTYPE html>
<head>
<title>
Notes
</title>
</head>

<body>
stuff
</body>
<html>

</html>";

    println!("Hello, world!");
    let mut file = File::create("../index.html")?;
    file.write_all(index)?;
    Ok(())
}
