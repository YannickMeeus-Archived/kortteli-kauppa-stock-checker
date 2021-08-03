use std::path::Path;
use std::fs::File;
use std::io::prelude::*;

pub fn parse_certificate_environment_variable(raw_string: &str) -> Vec<&str> {
    raw_string.split("\\n").filter(|l| !l.is_empty()).collect()
}

pub fn write_certificate_file(lines: Vec<&str>) -> () {
    let path = Path::new("./postgres.cert");
    let mut file = File::create(&path).expect("Failed to create file");

    for line in lines {
        writeln!(file, "{}", line).expect("Failed to write line to file")
    }
}