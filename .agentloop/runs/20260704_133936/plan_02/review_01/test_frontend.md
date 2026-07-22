# test-frontend

returncode: 0
seconds: 5.70
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

 ✓ src/api/client.test.ts  (5 tests) 10ms
 ✓ src/store/stores.test.ts  (8 tests) 20ms
 ✓ src/app/RoleGuard.test.tsx  (5 tests) 137ms
 ✓ src/components/ui/Pagination.test.tsx  (4 tests) 253ms
 ✓ src/components/ui/DataTable.test.tsx  (6 tests) 287ms
 ✓ src/components/odontogram/Odontogram.test.tsx  (6 tests) 709ms
 ✓ src/pages/DoctorDetailPage.test.tsx  (1 test) 378ms
 ✓ src/pages/LoginPage.test.tsx  (4 tests) 655ms
 ✓ src/pages/ReportsPage.test.tsx  (2 tests) 371ms

 Test Files  9 passed (9)
      Tests  41 passed (41)
   Start at  23:23:44
   Duration  5.10s (transform 1.54s, setup 5.54s, collect 5.10s, tests 2.82s, environment 13.33s, prepare 4.76s)


```

## STDERR
```text

```