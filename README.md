# client

Independent Java 25 project using Gradle Kotlin DSL and JUnit 5.

## Requirements

- JDK 25, available through `JAVA_HOME` or `PATH`.
- Internet access on the first build to download Gradle and dependencies.

## Commands

Run these commands from this repository or one of its worktrees:

```sh
./gradlew build
./gradlew test
./gradlew test --tests 'com.example.MyTest'
```

Replace `com.example.MyTest` with an actual test class. On Windows, use
`gradlew.bat` instead of `./gradlew`.

Production code belongs in `src/main/java`; tests belong in `src/test/java`.
No application code or tests have been added yet.
