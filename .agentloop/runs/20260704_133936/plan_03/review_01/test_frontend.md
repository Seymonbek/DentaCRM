# test-frontend

returncode: 0
seconds: 6.16
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
 ✓ src/app/RoleGuard.test.tsx  (5 tests) 111ms
 ✓ src/components/ui/Pagination.test.tsx  (4 tests) 205ms
 ✓ src/components/ui/DataTable.test.tsx  (6 tests) 253ms
 ✓ src/components/odontogram/Odontogram.test.tsx  (6 tests) 621ms
 ✓ src/pages/DoctorDetailPage.test.tsx  (1 test) 347ms
 ✓ src/pages/LoginPage.test.tsx  (4 tests) 613ms
 ✓ src/pages/ReportsPage.test.tsx  (2 tests) 463ms

 Test Files  9 passed (9)
      Tests  41 passed (41)
   Start at  00:32:33
   Duration  5.06s (transform 1.55s, setup 5.90s, collect 4.87s, tests 2.66s, environment 12.54s, prepare 5.47s)


```

## STDERR
```text

```