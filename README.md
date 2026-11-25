# TEE

TEE (Technology Education Exploration) is a website that gets high schoolers to spend time learning AI.

- **T, Prompt Maker:** build a study prompt in 3 taps.
- **E, Learn:** short, game-like AI lessons with XP, levels, badges and streaks.
- **E, Explore:** careers, volunteering and internships.

It's built for school computers. There are no logins, no tracking and no server. Progress is saved only in the browser.

## Run it

You need [Node.js](https://nodejs.org) 20.19 or newer.

```bash
npm install
```

```bash
npm run dev
```

Then open the link it prints. Other commands: `npm test` checks the rules and content, and `npm run build` makes the final site in `dist/`.

## Change the content

You don't need to touch code for these:

| To change | Edit |
| --- | --- |
| Subjects, goals and prompt wording | `src/data/prompts.json` |
| Courses, lessons and check-ins | `src/data/courses.json` |
| Opportunities | `src/data/opportunities.json` |

Run `npm test` after editing. It catches mistakes like a missing answer.

**Lessons.** Check-in types are `tap`, `thisOrThat`, `sort` and `trueFalse`. Answers count from 0. Explainer cards draw `words`, or `shapes` (`o` circle, `s` square, `?` unknown, `v` arrow, `.` gap). A card with neither says "Animation coming soon". To use a real video, put the file in `public/` and add `"video": "./name.mp4"` to the lesson's `explainer`.

**Opportunities.** All the listings are made-up samples. When you add a real one, use its real link and set `"sample": false`. Use `"deadline": null` for rolling.

## Where things are

| Folder | What's in it |
| --- | --- |
| `src/features/` | One folder per feature, so each can be changed or swapped alone |
| `src/progress/` | XP, levels, badges, streaks and saving. Point values are in `rules.ts` |
| `src/components/` | Shared pieces like the nav and buttons |
| `src/index.css` | Colors and font |

## Rules to keep

- No names, emails, logins, tracking or outside scripts. The build blocks outside files on purpose (see `vite.config.ts`).
- No live AI. Everything comes from the data files.
- One main action per screen, few words, details behind "Learn more".

## Work together

1. Get the latest: `git checkout main`, then `git pull`
2. Start a branch: `git checkout -b my-change`
3. Save your work: `git add .`, then `git commit -m "What I changed"`
4. Share it: `git push -u origin my-change`
5. Open a pull request on GitHub so the other person can look before it goes into `main`.
