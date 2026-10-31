# Client repository guidance

- This is an independent Java 25 repository using Gradle Kotlin DSL and the Gradle wrapper.
- Keep the Java toolchain configured for version 25 in `build.gradle.kts`.
- Production code belongs in `src/main/java`; tests belong in `src/test/java`.
- Tests use JUnit 5. No application code or tests have been added yet.
- Run commands from this repository or its development worktree.
- Build and verify: `./gradlew build`.
- Full test suite: `./gradlew test`.
- Single test class: `./gradlew test --tests 'com.example.MyTest'` (replace with an actual test class).
