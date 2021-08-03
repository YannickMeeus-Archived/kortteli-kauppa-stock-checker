use std::path::Path;
use std::fs::File;

pub fn parse_certificate_environment_variable(raw_string: &str) -> Vec<&str> {
    raw_string.split("\\n").filter(|l| !l.is_empty()).collect()
}

pub fn write_certificate_file(lines: Vec<&str>) -> void {
    let path = Path::new("./postgres.cert");
    let mut file = match File::create(&path) {
        Err(why) => panic!("couldn't create {}: {}", display, why),
        Ok(file) => file
    };

    for line in lines {
        match writeln!(file, "{}", line.to_string().as_str()) {
            Err(why) => panic!("couldn't write to {}: {}", display, why),
            Ok(_) => println!("successfully wrote to {}", display),
        }
    }
}