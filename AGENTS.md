# AGENTS.md — Repository Instructions for Coding Agents

## મુખ્ય નિયમ (Core Workflow Rule)

> "યુઝર જ્યારે પણ કોઈ ફેરફાર કહે, ત્યારે પૂછ્યા વગર તરત જ code બદલીને, build ચકાસીને, સીધો જ GitHub પર commit અને push કરી દેવો અને PR ખોલી દેવી."

Whenever the user requests any change in this repository:
1. **Make the code changes immediately** without asking for confirmation first.
2. **Verify the build** (`npm run build`) to ensure there are no TypeScript, Next.js, or bundling errors.
3. **Commit and push directly to GitHub** on the active session branch.
4. **Open (or update) a Pull Request** on GitHub immediately after pushing.
