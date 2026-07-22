# test-frontend

returncode: 0
seconds: 6.00
timed_out: False

## Command
```text
bash -lc npm run test -- --run
```

## STDOUT
```text

> dentacrm-frontend@0.1.0 test
> vitest run --run


 RUN  v2.1.1 /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/frontend

 ✓ src/api/client.test.ts  (5 tests) 17ms
 ✓ src/store/stores.test.ts  (8 tests) 27ms
 ✓ src/app/RoleGuard.test.tsx  (5 tests) 107ms
 ✓ src/components/ui/Pagination.test.tsx  (4 tests) 161ms
 ✓ src/components/ui/DataTable.test.tsx  (6 tests) 254ms
 ✓ src/components/odontogram/Odontogram.test.tsx  (6 tests) 581ms
 ✓ src/pages/DoctorDetailPage.test.tsx  (1 test) 268ms
 ✓ src/pages/LoginPage.test.tsx  (4 tests) 523ms
 ✓ src/pages/ReportsPage.test.tsx  (2 tests) 394ms

 Test Files  9 passed (9)
      Tests  41 passed (41)
   Start at  01:06:34
   Duration  4.92s (transform 1.39s, setup 5.96s, collect 4.48s, tests 2.33s, environment 12.51s, prepare 6.17s)


```

## STDERR
```text

```